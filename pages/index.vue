<template>
  <section>
    <!-- header start -->
    <b-navbar fixed="top" toggleable="sm" type="dark" variant="info">
      <b-navbar-brand href="/">ChartSample</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right no-caret>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <span class="navbar-toggler-icon"></span>
        </template>
        <b-dropdown-item disabled>---Sample Pages---</b-dropdown-item>
        <b-dropdown-item href="/charts">charts</b-dropdown-item>
        <b-dropdown-item href="/widgets">widgets</b-dropdown-item>
        <b-dropdown-item href="/base/breadcrumbs">base-breadcrumbs</b-dropdown-item>
        <b-dropdown-item href="/base/cards">base-cards</b-dropdown-item>
        <b-dropdown-item href="/base/carousels">base-carousels</b-dropdown-item>
        <b-dropdown-item href="/base/collapses">base-collapses</b-dropdown-item>
        <b-dropdown-item href="/base/forms">base-forms</b-dropdown-item>
        <b-dropdown-item href="/base/jumbotrons">base-jumbotrons</b-dropdown-item>
        <b-dropdown-item href="/base/list-groups">base-list-groups</b-dropdown-item>
        <b-dropdown-item href="/base/navbars">base-navbars</b-dropdown-item>
        <b-dropdown-item href="/base/navs">base-navs</b-dropdown-item>
        <b-dropdown-item href="/base/paginations">base-paginations</b-dropdown-item>
        <b-dropdown-item href="/base/popovers">base-popovers</b-dropdown-item>
        <b-dropdown-item href="/base/progress-bars">base-progress-bars</b-dropdown-item>
        <b-dropdown-item href="/base/switches">base-switches</b-dropdown-item>
        <b-dropdown-item href="/base/table">base-table</b-dropdown-item>
        <b-dropdown-item href="/base/tables">base-tables</b-dropdown-item>
        <b-dropdown-item href="/base/tooltips">base-tooltips</b-dropdown-item>
        <b-dropdown-item href="/buttons/button-groups">buttons-button-groups</b-dropdown-item>
        <b-dropdown-item href="/buttons/dropdowns">buttons-dropdowns</b-dropdown-item>
        <b-dropdown-item href="/buttons/social-buttons">buttons-social-buttons</b-dropdown-item>
        <b-dropdown-item href="/buttons/standard-buttons">buttons-standard-buttons</b-dropdown-item>
        <b-dropdown-item href="/icons/flags">icons-flags</b-dropdown-item>
        <b-dropdown-item href="/icons/font-awesome">icons-font-awesome</b-dropdown-item>
        <b-dropdown-item href="/icons/simple-line-icons">icons-simple-line-icons</b-dropdown-item>
        <b-dropdown-item href="/notifications/alerts">notifications-alerts</b-dropdown-item>
        <b-dropdown-item href="/notifications/badges">notifications-badges</b-dropdown-item>
        <b-dropdown-item href="/notifications/modals">notifications-modals</b-dropdown-item>
        <b-dropdown-item href="/pages/404">pages-404</b-dropdown-item>
        <b-dropdown-item href="/pages/500">pages-500</b-dropdown-item>
        <b-dropdown-item href="/pages/login">pages-login</b-dropdown-item>
        <b-dropdown-item href="/pages/register">pages-register</b-dropdown-item>
        <b-dropdown-item href="/theme/colors">theme-colors</b-dropdown-item>
        <b-dropdown-item href="/theme/typography">theme-typography</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- header end -->

    <!-- 質問がある場合 -->
    <div v-for="q in questions" :key="q.id" v-if="questions.length">
      <!-- Question Card start -->
      <b-card
        style="margin: 70px 20px 30px;"
        header="Question"
        :title="q.labels"
      >
        <b-button-toolbar>
          <div class="mx-auto">
            <b-button-group class="mx-1" v-for="dataset in q.chartData.datasets" :key="dataset.id">
              <b-button
                pill
                :style="'color: #FFFFFF; background-color:' + dataset.backgroundColor + '; border-color:' + dataset.backgroundColor"
                @click="incrementAnswer(q.doc_id, dataset.key)"
              >
                {{ dataset.label }}
              </b-button>
            </b-button-group>
          </div>
        </b-button-toolbar>
      </b-card>
      <!-- Question Card end -->

      <!-- Question Result start -->
      <b-card
        style="margin: 30px 20px 30px;"
        header="Result"
      >
        <div class="chart-container">
          <ChartBar
            :chartData="q.chartData"
            :options="q.chartOption"
            :styles="chartStyles"
          />
        </div>
      </b-card>
      <!-- Question Result end -->
    </div>

    <!-- 質問がない場合 -->
    <div v-else>
      <b-card
        style="margin: 70px 20px 30px;"
        header="Question is not exist"
        title="質問を登録してください"
      >
    </b-card>
    </div>

    <!-- footer start -->
    <b-navbar fixed="bottom" variant="info">
      <div  class="mx-auto">
        © 2020 S.O
      </div>
    </b-navbar>
    <!-- footer end -->
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"
import { ChartData, ChartOptions } from "chart.js";
import ChartBar from "~/components/ChartBar.vue";
import db from "~/plugins/firebase.ts";
import * as firebase from "firebase";

// 質問
interface questions {
  doc_id: string;
  labels: string[];
  chartData: ChartData;
  chartOption: ChartOptions;
}

// 回答の選択肢
interface datasetsform {
  key: string;
  label: string;
  data: number[];
  backgroundColor: string;
}

@Component({
  components: {
    ChartBar
  }
})
export default class ChartPage extends Vue {
  // データ(ChartDataやChartOptionなど)
  private questions: questions[] = [];

  // created
  private created () {
    // questionsに更新があると実行される
    db.collection('questions').onSnapshot(querySnapshot => {
      this.getChartInfo();
    })
  }

  // ChartDataやChartOptionを取得する
  private async getChartInfo () {
    // awaitでquestionsを取得
    await db.collection('questions').get().then(snap => {
      // 取得したCollection内のDocument分をループ
      snap.forEach(doc => {
        let labels: string[] = []; // ChartDataのlabels用
        let datasets: datasetsform[] = []; // ChartDataのdatasets用
        let max_data: number = 0; // ChartOptionのy軸の高さの動的変更用

        // Documentのtextを取得
        labels.push(doc.data().text);
        // Documentのanswerを取得
        Object.keys(doc.data().answer).forEach(key => {
          let value = doc.data().answer[key]
          datasets.push({key: key, label: value.label, data: [value.data], backgroundColor: value.backgroundColor})
          // dataの最大値を取得
          if (max_data < Number(value.data)) {
            max_data = Number(value.data);
          }
        });

        // 取得したDocumentがすでに表示されている場合はchartDataを更新、表示されていない場合はchartDataを追加
        let index: number = this.questions.findIndex(obj => { return obj.doc_id == doc.id; })
        if (index >= 0) {
          // chartData更新
          this.questions[index].chartData = {labels, datasets}
          // chartOptionのy軸の高さはデータが9割になったら、高さを2倍にする
          let max: number = this.questions[index].chartOption.scales!.yAxes![0].ticks!.max
          if (max * 0.9 < max_data) {
            this.questions[index].chartOption = {maintainAspectRatio: false, scales: {yAxes: [{ticks: {beginAtZero: true, min: 0, max: max * 2}}]}}
          }
        } else {
          // chartOptionのy軸の高さはデータが9割になっていたら、高さを2倍にする(デフォルトは20)
          let max: number = 0;
          if (max_data >= 18) {
            for (var i=0;  i < 100;  i++) {
              let nearest: number = 20 * (2**i);
              if (max_data < nearest * 0.9) {
                max = nearest
                break;
              }
            }
          } else {
            max = 20
          }
          // chartData/chartOption追加
          this.questions.push({
            doc_id: doc.id,
            labels: doc.data().text,
            chartData: {labels, datasets},
            chartOption: {maintainAspectRatio: false, scales: {yAxes: [{ticks: {beginAtZero: true, min: 0, max: max}}]}}
          })
        }
      })
    })
  }

  // 投票ボタンを押したらdataをインクリメント
  private incrementAnswer (doc_id: string, dataset_key: string) {
    let doc = db.collection('questions').doc(doc_id);
    doc.update({
      ["answer." + dataset_key + ".data"]: firebase.firestore.FieldValue.increment(1)
    });
  }

  // チャートのスタイル: <canvas>のstyle属性として設定
  private chartStyles = {
    height: "100%",
    width: "100%"
  };
}
</script>

<style lang="scss">
.chart-container {
  /**
   * vue-chartjsで生成する<canvas>がabsoluteのため、
   * relateveを設定
   */
  position: relative;

  /**
   * chartStylesを設定しているので、
   * height/wightが有効になる
   */
  height: 40vh;
  width: 80vw;
  margin: 0 auto;
}
</style>